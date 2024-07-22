import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HelpDeskApp from './internalNotes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Adding internal notes to tickets should show success message.', async () => {
  fetchMock.post('/api/add-internal-note', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note added successfully')).toBeInTheDocument();
}, 10000);

test('Adding internal notes to tickets should show error message when failed.', async () => {
  fetchMock.post('/api/add-internal-note', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note addition failed')).toBeInTheDocument();
}, 10000);