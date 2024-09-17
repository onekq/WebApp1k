import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editAllergies_searchActivityLogs';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

test('Searches activities by keyword successfully.', async () => {
  fetchMock.get('/activities?keyword=walk', [{ description: 'Morning walk' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByText('Morning walk')).toBeInTheDocument();
}, 10000);

test('Fails to search activities with error message.', async () => {
  fetchMock.get('/activities?keyword=walk', { status: 500, body: { message: 'Failed to search activities' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'walk' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('search-button')); });

  expect(fetchMock.calls('/activities?keyword=walk').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);