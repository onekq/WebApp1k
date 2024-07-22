import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import UserPreferencesComponent from './userPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User preferences should be stored and applied successfully.', async () => {
  fetchMock.post('/api/user/preferences', 200);

  await act(async () => { render(<MemoryRouter><UserPreferencesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-saved')).toBeInTheDocument();
}, 10000);

test('Error in storing user preferences should show error message.', async () => {
  fetchMock.post('/api/user/preferences', 500);

  await act(async () => { render(<MemoryRouter><UserPreferencesComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('preference-input'), { target: { value: 'preference' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-preference')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('preference-error')).toBeInTheDocument();
}, 10000);

