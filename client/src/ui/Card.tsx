import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
      {children}
    </div>
  )
}
