import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './discussionForumParticipation_interactiveContentHandling_peerReviewAssignments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully posts a new forum post', async () => {
  fetchMock.post('/forum/posts', { status: 201 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post successful')).toBeInTheDocument();
}, 10000);

test('Fails to post a new forum post', async () => {
  fetchMock.post('/forum/posts', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('post-content'), { target: { value: 'New post' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Post')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Posting failed')).toBeInTheDocument();
}, 10000);

test('Success: interactive content loads successfully', async () => {
  fetchMock.get('/api/interactive-content', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Interactive content loaded')).toBeInTheDocument();
}, 10000);

test('Failure: interactive content fails to load', async () => {
  fetchMock.get('/api/interactive-content', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading interactive content')).toBeInTheDocument();
}, 10000);

test('Success: peer review assignment submitted', async () => {
  fetchMock.post('/api/peer-review', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submitted')).toBeInTheDocument();
}, 10000);

test('Failure: peer review assignment submission fails', async () => {
  fetchMock.post('/api/peer-review', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('peer-review-text'), { target: { value: 'review' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Peer review submission failed')).toBeInTheDocument();
}, 10000);
