import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './agentTracking_autoResponseTemplates_ticketComments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Tracking the agent assigned to a ticket should show agent name.', async () => {
  fetchMock.post('/api/track-agent', { agent: 'James Bond' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Assigned to: James Bond')).toBeInTheDocument();
}, 10000);

test('Tracking the agent assigned to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/track-agent', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-id-track'), { target: { value: '789' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('track-agent')); });

  expect(fetchMock.calls('/api/track-agent').length).toBe(1);
  expect(screen.getByText('Agent tracking failed')).toBeInTheDocument();
}, 10000);

test('Successfully configures auto-response templates.', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Template saved')).toBeInTheDocument();
}, 10000);

test('Fails to configure auto-response templates.', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save template')).toBeInTheDocument();
}, 10000);

test('Adding comments to a ticket should show success message.', async () => {
  fetchMock.post('/api/add-comment', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment added successfully')).toBeInTheDocument();
}, 10000);

test('Adding comments to a ticket should show error message when failed.', async () => {
  fetchMock.post('/api/add-comment', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticket-comment'), { target: { value: 'This is a comment' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('add-comment')); });

  expect(fetchMock.calls('/api/add-comment').length).toBe(1);
  expect(screen.getByText('Comment addition failed')).toBeInTheDocument();
}, 10000);
