import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import PeerReviewAssignmentsComponent from './peerReviewAssignments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: peer review assignment submitted', async () => {
  fetchMock.post('/api/peer-review', 200);

  await act(async () => { render(<MemoryRouter><PeerReviewAssignmentsComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submitted')).toBeInTheDocument();
}, 10000);

test('Failure: peer review assignment submission fails', async () => {
  fetchMock.post('/api/peer-review', 500);

  await act(async () => { render(<MemoryRouter><PeerReviewAssignmentsComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submission failed')).toBeInTheDocument();
}, 10000);

