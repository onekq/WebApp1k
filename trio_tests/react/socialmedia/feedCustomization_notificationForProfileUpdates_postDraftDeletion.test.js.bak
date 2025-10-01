import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedCustomization_notificationForProfileUpdates_postDraftDeletion';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully customizes feed to show only posts with images.', async () => {
  fetchMock.post('/api/customize', {
    status: 200, body: { message: 'Feed customized' }
  });

  await act(async () => {
    render(<MemoryRouter><CustomizationComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Show Only Images'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Feed customized')).toBeInTheDocument();
}, 10000);

test('Shows error message when customizing feed fails.', async () => {
  fetchMock.post('/api/customize', {
    status: 500, body: { message: 'Failed to customize feed' }
  });

  await act(async () => {
    render(<MemoryRouter><CustomizationComponent /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Show Only Images'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to customize feed')).toBeInTheDocument();
}, 10000);

test('should send a notification when a profile is updated', async () => {
  fetchMock.post('/api/profile/update', { success: true });

  await act(async () => { render(<MemoryRouter><Profile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('notification')).toBeInTheDocument();
}, 10000);

test('should handle error when notification sending fails for a profile update', async () => {
  fetchMock.post('/api/profile/update', 500);

  await act(async () => { render(<MemoryRouter><Profile /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-input'), {target: {value: 'new info'}}); });
  await act(async () => { fireEvent.click(screen.getByTestId('save-profile-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Verify deletion of saved drafts.', async () => {
  fetchMock.delete('/api/posts/draft/1', 200);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft deleted successfully!')).toBeInTheDocument();
}, 10000);

test('Ensure error handling for non-existent draft deletion.', async () => {
  fetchMock.delete('/api/posts/draft/1', 404);

  await act(async () => {
    render(<MemoryRouter><SocialMediaApp /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText('Delete Draft'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Draft not found.')).toBeInTheDocument();
}, 10000);
