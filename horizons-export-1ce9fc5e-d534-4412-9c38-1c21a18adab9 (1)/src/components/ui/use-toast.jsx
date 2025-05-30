import * as React from "react"

const toastContext = React.createContext({
  toasts: [],
  toast: () => {}
})

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([])

  const toast = ({ title, description, variant = "default", className = "" }) => {
    const id = Date.now()
    const newToast = { id, title, description, variant, className }
    
    setToasts(prev => [...(prev || []), newToast])
    
    setTimeout(() => {
      setToasts(prev => (prev || []).filter(t => t.id !== id))
    }, 3000)
  }

  return (
    <toastContext.Provider value={{ toasts: toasts || [], toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {(toasts || []).map(toast => (
          <div
            key={toast.id}
            className={`bg-slate-800 text-white p-4 rounded-lg shadow-lg max-w-sm ${toast.className}`}
          >
            {toast.title && <div className="font-semibold">{toast.title}</div>}
            {toast.description && <div className="text-sm">{toast.description}</div>}
          </div>
        ))}
      </div>
    </toastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(toastContext)
  if (!context) {
    return { 
      toasts: [],
      toast: () => {} 
    }
  }
  return context
}
