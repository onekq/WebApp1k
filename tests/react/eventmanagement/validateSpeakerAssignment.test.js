import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './validateSpeakerAssignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully validates speaker assignment.', async () => {
  fetchMock.post('/api/validateSpeakerAssignment', { assigned: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('speaker-select'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-speaker-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Speaker assigned')).toBeInTheDocument();
}, 10000);

test('Fails to validate missing speaker assignment.', async () => {
  fetchMock.post('/api/validateSpeakerAssignment', { error: 'Speaker is required' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('speaker-select'), { target: { value: '' } }); });
  await act(async () => { fireEvent.submit(screen.getByTestId('submit-speaker-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Speaker is required')).toBeInTheDocument();
}, 10000);

