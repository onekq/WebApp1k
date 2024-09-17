import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './eventAccessibilityOptions_validateConcurrentSessions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays event accessibility options', async () => {
  fetchMock.get('/api/event/accessibility', { wheelchairAccess: true, signLanguageInterpreter: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Wheelchair access')).toBeInTheDocument();
  expect(screen.getByText('Sign language interpreter')).toBeInTheDocument();
}, 10000);

test('Displays error message when accessibility options are unavailable', async () => {
  fetchMock.get('/api/event/accessibility', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Accessibility options are unavailable')).toBeInTheDocument();
}, 10000);

test('Successfully validates no overlapping concurrent sessions.', async () => {
  fetchMock.post('/api/validateConcurrentSessions', { valid: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-concurrent-sessions-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No overlap in concurrent sessions')).toBeInTheDocument();
}, 10000);

test('Fails to validate overlapping concurrent sessions.', async () => {
  fetchMock.post('/api/validateConcurrentSessions', { error: 'Sessions overlap' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-concurrent-sessions-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Sessions overlap')).toBeInTheDocument();
}, 10000);