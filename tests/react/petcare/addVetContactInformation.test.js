import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './addVetContactInformation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Add vet contact information successfully.', async () => {
  fetchMock.post('/api/vets', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: 'Dr. Smith'}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet contact information added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add vet contact information due to missing vet name.', async () => {
  fetchMock.post('/api/vets', 400);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/vet name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/phone/i), {target: {value: '123-456-7890'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Vet Contact/i)); });

  expect(fetchMock.calls('/api/vets').length).toBe(1);
  expect(screen.getByText('Vet name is required.')).toBeInTheDocument();
}, 10000);