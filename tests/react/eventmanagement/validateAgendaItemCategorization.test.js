import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateAgendaItemCategorization';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates agenda item categorization.', async () => {
  fetchMock.post('/api/validateAgendaItemCategorization', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-categorization-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Agenda item categorized')).toBeInTheDocument();
}, 10000);

test('Fails to validate agenda item categorization.', async () => {
  fetchMock.post('/api/validateAgendaItemCategorization', { error: 'Failed to categorize agenda item' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-categorization-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to categorize agenda item')).toBeInTheDocument();
}, 10000);

