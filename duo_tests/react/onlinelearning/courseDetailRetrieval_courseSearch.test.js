import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseDetailRetrieval_courseSearch';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Course Detail Retrieval success: should display course details.', async () => {
  fetchMock.get('/api/courses/1', { id: 1, title: 'React Course', details: 'Detailed info' });

  await act(async () => { render(<MemoryRouter><App courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Detailed info')).toBeInTheDocument();
}, 10000);

test('Course Detail Retrieval failure: should display an error message on failed detail retrieval.', async () => {
  fetchMock.get('/api/courses/1', 404);

  await act(async () => { render(<MemoryRouter><App courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course details cannot be retrieved.')).toBeInTheDocument();
}, 10000);

test('Course Search success: should display search results.', async () => {
  fetchMock.get('/api/courses?search=React', [{ id: 1, title: 'React Course' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'React' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('React Course')).toBeInTheDocument();
}, 10000);

test('Course Search failure: should display an error message if no results found.', async () => {
  fetchMock.get('/api/courses?search=Unknown', []);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Search for courses...'), { target: { value: 'Unknown' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Search')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('No courses found.')).toBeInTheDocument();
}, 10000);