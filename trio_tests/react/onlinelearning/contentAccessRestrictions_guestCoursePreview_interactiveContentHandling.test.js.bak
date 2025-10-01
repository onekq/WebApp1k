import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentAccessRestrictions_guestCoursePreview_interactiveContentHandling';

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

test('Success: guest previews course successfully', async () => {
  fetchMock.get('/api/course-preview', 200);

  await act(async () => { render(<MemoryRouter><GuestCoursePreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course preview loaded')).toBeInTheDocument();
}, 10000);

test('Failure: guest course preview fails', async () => {
  fetchMock.get('/api/course-preview', 500);

  await act(async () => { render(<MemoryRouter><GuestCoursePreviewComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading course preview')).toBeInTheDocument();
}, 10000);

test('Success: interactive content loads successfully', async () => {
  fetchMock.get('/api/interactive-content', 200);

  await act(async () => { render(<MemoryRouter><InteractiveContentComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Interactive content loaded')).toBeInTheDocument();
}, 10000);

test('Failure: interactive content fails to load', async () => {
  fetchMock.get('/api/interactive-content', 500);

  await act(async () => { render(<MemoryRouter><InteractiveContentComponent /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading interactive content')).toBeInTheDocument();
}, 10000);
