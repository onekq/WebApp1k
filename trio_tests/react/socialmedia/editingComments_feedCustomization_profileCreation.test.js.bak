import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editingComments_feedCustomization_profileCreation';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Should update an existing comment', async () => {
  fetchMock.put('api/comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: 'Updated comment' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should display an error when updating a comment with invalid data', async () => {
  fetchMock.put('api/comment', { status: 400 });

  await act(async () => { render(<MemoryRouter><SocialMediaApp /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('edit-comment-input'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

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

test('Profile creation succeeds with valid inputs', async () => {
  fetchMock.post('/api/profile', { body: { message: 'Profile created' }, status: 201 });

  await act(async () => { render(<MemoryRouter><ProfileCreationForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: 'John Doe' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Profile created')).toBeInTheDocument();
}, 10000);

test('Profile creation fails with invalid inputs', async () => {
  fetchMock.post('/api/profile', { body: { error: 'Invalid profile inputs' }, status: 400 });

  await act(async () => { render(<MemoryRouter><ProfileCreationForm /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('profile-name'), { target: { value: '' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Profile')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Invalid profile inputs')).toBeInTheDocument();
}, 10000);
