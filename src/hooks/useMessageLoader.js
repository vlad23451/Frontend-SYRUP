import { useRef, useEffect, useCallback } from 'react';

const useMessageLoader = (options) => {
  const {
    scrollContainerRef,
    loadMore,
    hasMore,
    loading,
    threshold = 75,
    chatId,
  } = options;

  const stateByChatRef = useRef({});
  const loadingRef = useRef(loading);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  
  // Инициализация состояния для нового чата
  useEffect(() => {
    if (chatId && !stateByChatRef.current[chatId]) {
      stateByChatRef.current[chatId] = {
        viewedMessages: new Set(),
        triggerThreshold: threshold,
      };
      console.log(`Initialized state for chat ${chatId}`);
    }
  }, [chatId, threshold]);

  const reset = useCallback(() => {
    if (chatId && stateByChatRef.current[chatId]) {
      stateByChatRef.current[chatId].viewedMessages.clear();
      stateByChatRef.current[chatId].triggerThreshold = threshold;
      console.log(`Message loader has been reset for chat ${chatId}.`);
    }
  }, [chatId, threshold]);

  const handleIntersect = useCallback((entries) => {
    if (loadingRef.current || !hasMore || !chatId || !stateByChatRef.current[chatId]) {
      return;
    }

    const chatState = stateByChatRef.current[chatId];

    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const messageId = entry.target.id;
        if (messageId) {
          chatState.viewedMessages.add(messageId);
        }
      }
    });

    console.log(`Viewed message IDs for chat ${chatId}:`, Array.from(chatState.viewedMessages));

    if (chatState.viewedMessages.size >= chatState.triggerThreshold) {
      loadMore();
      // Увеличиваем порог для следующего срабатывания
      chatState.triggerThreshold += threshold;
    }
  }, [loadMore, hasMore, threshold, chatId]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
      return;
    }

    const intersectionObserver = new IntersectionObserver(handleIntersect, {
      root: scrollContainer,
      rootMargin: '0px',
      threshold: 0.1,
    });

    const mutationObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.matches('.message-item[id]')) {
              intersectionObserver.observe(node);
            }
          });
        }
      }
    });

    const initialElements = scrollContainer.querySelectorAll('.message-item[id]');
    initialElements.forEach(el => intersectionObserver.observe(el));

    mutationObserver.observe(scrollContainer, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [scrollContainerRef, handleIntersect, options.messageCount]);

  return { reset };
};

export default useMessageLoader;
