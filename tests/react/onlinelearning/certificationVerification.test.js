import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CertificateVerification from './certificationVerification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Certificate is verified successfully.', async () => {
  fetchMock.post('/api/certificates/verify', { valid: true });

  await act(async () => { render(<MemoryRouter><CertificateVerification /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is valid/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate verification fails.', async () => {
  fetchMock.post('/api/certificates/verify', { valid: false });

  await act(async () => { render(<MemoryRouter><CertificateVerification /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is invalid/i)).toBeInTheDocument();
}, 10000);
