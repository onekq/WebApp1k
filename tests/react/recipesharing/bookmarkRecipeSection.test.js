import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import YourComponent from './bookmarkRecipeSection';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Bookmark Recipe Section successfully', async () => {
  fetchMock.post('/api/recipe/1/bookmark', { body: { message: 'Section bookmarked' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark Section')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Section bookmarked')).toBeInTheDocument();
}, 10000);

test('Bookmark Recipe Section failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/bookmark', { body: { message: 'Error bookmarking section' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Bookmark Section')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error bookmarking section')).toBeInTheDocument();
}, 10000);

