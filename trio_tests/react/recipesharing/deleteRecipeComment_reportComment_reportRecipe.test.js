import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './deleteRecipeComment_reportComment_reportRecipe';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully delete a recipe comment', async () => {
  fetchMock.delete('/api/delete-comment', { status: 200 });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('delete-comment-message')).toBeInTheDocument();
}, 10000);

test('Fail to delete a recipe comment with error message', async () => {
  fetchMock.delete('/api/delete-comment', 500);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('delete-comment-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('successfully reports a comment', async () => {
  fetchMock.post('/report-comment', 200);

  await act(async () => { render(<MemoryRouter><ReportCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Comment reported')).toBeInTheDocument();
}, 10000);

test('shows error message when failing to report a comment', async () => {
  fetchMock.post('/report-comment', 500);

  await act(async () => { render(<MemoryRouter><ReportCommentComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report comment')).toBeInTheDocument();
}, 10000);

test('Report Recipe successfully', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Recipe reported' }, status: 200 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Recipe reported')).toBeInTheDocument();
}, 10000);

test('Report Recipe failure shows error message', async () => {
  fetchMock.post('/api/recipe/1/report', { body: { message: 'Error reporting recipe' }, status: 500 });

  await act(async () => { render(<MemoryRouter><YourComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Report Recipe')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error reporting recipe')).toBeInTheDocument();
}, 10000);
