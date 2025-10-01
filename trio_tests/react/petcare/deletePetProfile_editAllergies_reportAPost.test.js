import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deletePetProfile_editAllergies_reportAPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Delete pet profile successfully.', async () => {
  fetchMock.delete('/api/pets/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Pet profile deleted successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to delete pet profile due to server error.', async () => {
  fetchMock.delete('/api/pets/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Delete Pet/i)); });

  expect(fetchMock.calls('/api/pets/1').length).toBe(1);
  expect(screen.getByText('Failed to delete pet profile.')).toBeInTheDocument();
}, 10000);

test('Edit allergies successfully.', async () => {
  fetchMock.put('/api/allergies/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Allergy updated successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to edit allergies due to server error.', async () => {
  fetchMock.put('/api/allergies/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/allergy/i), {target: {value: 'Peanuts'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Edit Allergy/i)); });

  expect(fetchMock.calls('/api/allergies/1').length).toBe(1);
  expect(screen.getByText('Failed to update allergy.')).toBeInTheDocument();
}, 10000);

test('Successfully reports an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post reported successfully')).toBeInTheDocument();
}, 10000);

test('Fails to report an inappropriate post', async () => {
  fetchMock.post('/api/community/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report post')).toBeInTheDocument();
}, 10000);
