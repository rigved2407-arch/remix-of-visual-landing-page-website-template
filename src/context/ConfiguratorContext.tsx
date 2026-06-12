import { createContext, useContext, useState, ReactNode } from 'react'

interface ConfiguratorContextType {
  isOpen: boolean
  openConfigurator: () => void
  closeConfigurator: () => void
}

const ConfiguratorContext = createContext<ConfiguratorContextType | null>(null)

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ConfiguratorContext.Provider
      value={{
        isOpen,
        openConfigurator:  () => setIsOpen(true),
        closeConfigurator: () => setIsOpen(false),
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  )
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext)
  if (!ctx) throw new Error('useConfigurator must be used inside ConfiguratorProvider')
  return ctx
}
