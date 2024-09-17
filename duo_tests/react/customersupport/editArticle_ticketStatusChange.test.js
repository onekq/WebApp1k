import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editArticle_ticketStatusChange';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully edits existing articles', async () => {
  fetchMock.put('path/to/api/article', 200);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('fails to edit existing articles with error message', async () => {
  fetchMock.put('path/to/api/article', 500);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('article-input'), { target: { value: 'Updated Article' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('edit-article-button'));
  });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully changes the status of a ticket', async () => {
  fetchMock.put('/api/tickets/1/status', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Status updated successfully!')).toBeInTheDocument();
}, 10000);

test('shows error if changing status fails', async () => {
  fetchMock.put('/api/tickets/1/status', 500);
  
  await act(async () => { render(<MemoryRouter><App ticketId={1} /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Status')); });
  
  expect(fetchMock.calls('/api/tickets/1/status').length).toBe(1);
  expect(screen.getByText('Failed to update status')).toBeInTheDocument();
}, 10000);