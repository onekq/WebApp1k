import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customizableCertificates_userProgressExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Certificate templates are customizable.', async () => {
  fetchMock.post('/api/certificates/customize', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'new template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when customization fails.', async () => {
  fetchMock.post('/api/certificates/customize', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'invalid template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
}, 10000);

test('Successfully exports user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export successful')).toBeInTheDocument();
}, 10000);

test('Fails to export user progress data', async () => {
  fetchMock.get('/user-progress/export', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Export Progress')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Export failed')).toBeInTheDocument();
}, 10000);