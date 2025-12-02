import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={`border border-gray-300 px-3 py-2 rounded-md w-full ${className}`}
    />
  )
}
