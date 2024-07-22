import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateAgendaUpdates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Agenda updated')).toBeInTheDocument();
}, 10000);

test('Fails to validate agenda updates.', async () => {
  fetchMock.post('/api/validateAgendaUpdates', { error: 'Could not update agenda' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('update-agenda-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Could not update agenda')).toBeInTheDocument();
}, 10000);

