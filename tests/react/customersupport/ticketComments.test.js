import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import HelpDeskApp from './ticketComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Adding comments to a ticket should show success message.', async () => {
  fetchMock.post('/api/add-comment', { success: true });

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Adding comments to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/add-comment', 500);

  await act(async () => { render(<MemoryRouter><HelpDeskApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment addition failed')).toBeInTheDocument();
}, 10000);

