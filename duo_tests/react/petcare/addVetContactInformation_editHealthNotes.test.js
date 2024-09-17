import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addVetContactInformation_editHealthNotes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add vet contact information successfully.', async () => {
  fetchMock.post('/api/vets', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: 'Dr. Smith'}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet contact information added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vet contact information due to missing vet name.', async () => {
  fetchMock.post('/api/vets', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet name is required.')).toBeInTheDocument();
}, 10000);

test('Edit health notes successfully', async () => {
  fetchMock.put('/api/health-notes/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: 'Very healthy!' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Health notes updated')).toBeInTheDocument();
}, 10000);

test('Fail to edit health notes with error', async () => {
  fetchMock.put('/api/health-notes/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('notes-input'), { target: { value: '' } }); }); // Failure case: Empty input
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls('/api/health-notes/1').length).toBe(1);
  expect(screen.getByText('Failed to update health notes')).toBeInTheDocument(); // Error message
}, 10000);