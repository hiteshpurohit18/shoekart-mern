import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function Button({ children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-md bg-black text-white hover:opacity-85 ${className}`}
    >
      {children}
    </button>
  )
}
