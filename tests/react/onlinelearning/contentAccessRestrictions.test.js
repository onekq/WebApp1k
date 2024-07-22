import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ContentAccessRestrictions from './contentAccessRestrictions';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Content Access Restrictions success: should display restricted content.', async () => {
  fetchMock.get('/api/courses/1/content', { id: 1, title: 'Protected Content' });

  await act(async () => { render(<MemoryRouter><ContentAccessRestrictions courseId={1} permission="admin" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
}, 10000);

test('Content Access Restrictions failure: should display an error message on unauthorized access.', async () => {
  fetchMock.get('/api/courses/1/content', 403);

  await act(async () => { render(<MemoryRouter><ContentAccessRestrictions courseId={1} permission="guest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Access restricted.')).toBeInTheDocument();
}, 10000);