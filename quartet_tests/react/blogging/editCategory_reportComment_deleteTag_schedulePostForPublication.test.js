import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './editCategory_reportComment_deleteTag_schedulePostForPublication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('User can edit an existing category successfully (from editCategory_reportComment)', async () => {
  fetchMock.put('/categories/1', {
    status: 200,
    body: { id: 1, name: 'Updated Category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'Updated Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Category updated successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when editing a category fails (from editCategory_reportComment)', async () => {
  fetchMock.put('/categories/1', {
    status: 500,
    body: { error: 'Unable to update category' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Category Name'), { target: { value: 'Updated Category' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Update Category')); });

  expect(fetchMock.calls('/categories/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to update category')).toBeInTheDocument();
}, 10000);

test('successfully reports a comment (from editCategory_reportComment)', async () => {
  fetchMock.post('/api/comments/report/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Comment reported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to report a comment (from editCategory_reportComment)', async () => {
  fetchMock.post('/api/comments/report/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Failed to report comment/i)).toBeInTheDocument();
}, 10000);

test('User can delete a tag successfully (from deleteTag_schedulePostForPublication)', async () => {
  fetchMock.delete('/tags/1', {
    status: 204
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Tag deleted successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when deleting a tag fails (from deleteTag_schedulePostForPublication)', async () => {
  fetchMock.delete('/tags/1', {
    status: 500,
    body: { error: 'Unable to delete tag' }
  });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Delete Tag')); });

  expect(fetchMock.calls('/tags/1').length).toBe(1);
  expect(screen.getByText('Error: Unable to delete tag')).toBeInTheDocument();
}, 10000);

test('Success: schedule a post for future publication (from deleteTag_schedulePostForPublication)', async () => {
  fetchMock.post('/api/schedulePost', { status: 200, body: { id: 1, title: 'Scheduled Post', content: 'Some content', scheduledDate: '2023-10-10T12:00:00Z' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-10-10T12:00:00Z' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/schedule/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post scheduled successfully')).toBeInTheDocument();
}, 10000);

test('Failure: schedule a post with invalid date (from deleteTag_schedulePostForPublication)', async () => {
  fetchMock.post('/api/schedulePost', { status: 400, body: { error: 'Invalid date format' } });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: 'invalid-date' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/schedule/i));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Invalid date format')).toBeInTheDocument();
}, 10000);

