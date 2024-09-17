import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './assignmentGrading_certificationVerification';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Assignment grading logic works correctly.', async () => {
  fetchMock.post('/api/assignments/grade', { grade: 'A' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/assignment id/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/grade/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/grade: a/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when grading fails.', async () => {
  fetchMock.post('/api/assignments/grade', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/assignment id/i), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/grade/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to grade assignment/i)).toBeInTheDocument();
}, 10000);

test('Certificate is verified successfully.', async () => {
  fetchMock.post('/api/certificates/verify', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: '12345' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is valid/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate verification fails.', async () => {
  fetchMock.post('/api/certificates/verify', { valid: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/certificate id/i), { target: { value: 'invalid' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/verify/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/certificate is invalid/i)).toBeInTheDocument();
}, 10000);