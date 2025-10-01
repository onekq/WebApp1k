import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentArchiving_postDraftEditing_unlikingPosts';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully archives a post.', async () => {
  fetchMock.post('/api/archive', {
    status: 200, body: { message: 'Post archived' }
  });

  await act(async () => {
    render(<MemoryRouter><PostComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Archive'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post archived')).toBeInTheDocument();
}, 10000);

test('Shows error message when archiving a post fails.', async () => {
  fetchMock.post('/api/archive', {
    status: 500, body: { message: 'Failed to archive post' }
  });

  await act(async () => {
    render(<MemoryRouter><PostComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Archive'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to archive post')).toBeInTheDocument();
}, 10000);

test('Test editing saved drafts.', async () => {
  fetchMock.put('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: 'Updated draft content' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft updated successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure changes are saved and displayed (draft).', async () => {
  fetchMock.put('/api/posts/draft/1', 400);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByText('Edit Draft'), { target: { value: '' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Save Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to update draft.')).toBeInTheDocument();
}, 10000);

test('Should unlike a liked post', async () => {
  fetchMock.post('api/unlike', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button-post1')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when unliking a post not liked', async () => {
  fetchMock.post('api/unlike', { status: 404 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('unlike-button-invalid')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
