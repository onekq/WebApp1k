import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MaterialVersionControl from './materialVersionControl';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Material Version Control success: should display version control info.', async () => {
  fetchMock.get('/api/course-materials/1/versions', [{ version: 1, details: 'Initial Version' }]);

  await act(async () => { render(<MemoryRouter><MaterialVersionControl courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Initial Version')).toBeInTheDocument();
}, 10000);

test('Material Version Control failure: should display an error message on version retrieval failure.', async () => {
  fetchMock.get('/api/course-materials/1/versions', 404);

  await act(async () => { render(<MemoryRouter><MaterialVersionControl courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Version information cannot be retrieved.')).toBeInTheDocument();
}, 10000);

