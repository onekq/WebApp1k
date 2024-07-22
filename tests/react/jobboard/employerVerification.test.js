import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EmployerVerification from './employerVerification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('employers can be successfully verified before allowing job postings', async () => {
  fetchMock.post('/api/employer/verify', { success: true });

  await act(async () => { render(<MemoryRouter><EmployerVerification /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Employer verified successfully')).toBeInTheDocument();
}, 10000);

test('employers see an error message if verification fails', async () => {
  fetchMock.post('/api/employer/verify', 500);

  await act(async () => { render(<MemoryRouter><EmployerVerification /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Verify Employer/i)); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to verify employer')).toBeInTheDocument();
}, 10000);

