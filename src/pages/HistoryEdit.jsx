import React from "react"
import { useEditHistoryForm } from "../hooks/useEditHistoryForm"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import ErrorMessage from "../components/ui/ErrorMessage"
import EditHistoryForm from "../components/histories/EditHistoryForm"

const EditHistory = ({ onSave }) => {
  const { formData, loading, error, handleChange, handleSubmit } = useEditHistoryForm(onSave)

  if (loading) return <LoadingSpinner />
  
  if (error) return <ErrorMessage error={error} />

  return (
    <div className="page-container">
      <EditHistoryForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

export default EditHistory
