import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './editPetProfile';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Edit pet profile successfully.', async () => {
  fetchMock.put('/api/pets/1', 200);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Pet profile updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit pet profile due to server error.', async () => {
  fetchMock.put('/api/pets/1', 500);

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Failed to update pet profile.')).toBeInTheDocument();
}, 10000);
