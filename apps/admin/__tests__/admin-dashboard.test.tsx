import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import AdminDashboard from '../app/page'

test('Admin Dashboard renders correctly', () => {
  render(<AdminDashboard />)
  
  expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
  expect(screen.getByText('Welcome to your admin panel. Monitor and manage your application.')).toBeInTheDocument()
  expect(screen.getByText('Total Users')).toBeInTheDocument()
  expect(screen.getByText('Content Items')).toBeInTheDocument()
  expect(screen.getByText('User Management')).toBeInTheDocument()
  expect(screen.getByText('Content Management')).toBeInTheDocument()
}) 