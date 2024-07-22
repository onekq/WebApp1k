import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import GuestCoursePreviewComponent from './guestCoursePreview';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

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

