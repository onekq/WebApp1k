import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customizableCertificates_guestCoursePreview_courseMaterialUpload_instructorAssignment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Certificate templates are customizable. (from customizableCertificates_guestCoursePreview)', async () => {
  fetchMock.post('/api/certificates/customize', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'new template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/saved successfully/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when customization fails. (from customizableCertificates_guestCoursePreview)', async () => {
  fetchMock.post('/api/certificates/customize', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/template/i), { target: { value: 'invalid template' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to save/i)).toBeInTheDocument();
}, 10000);

test('Success: guest previews course successfully (from customizableCertificates_guestCoursePreview)', async () => {
  fetchMock.get('/api/course-preview', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course preview loaded')).toBeInTheDocument();
}, 10000);

test('Failure: guest course preview fails (from customizableCertificates_guestCoursePreview)', async () => {
  fetchMock.get('/api/course-preview', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('preview-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading course preview')).toBeInTheDocument();
}, 10000);

test('Success: instructor uploads course material (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/upload', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material uploaded successfully')).toBeInTheDocument();
}, 10000);

test('Failure: course material upload fails (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/upload', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('upload-file'), { target: { files: ['file'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Material upload failed')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment success: should display assigned instructor. (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/assign-instructor', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Instructor successfully assigned.')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment failure: should display an error message on assignment failure. (from courseMaterialUpload_instructorAssignment)', async () => {
  fetchMock.post('/api/assign-instructor', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to assign instructor.')).toBeInTheDocument();
}, 10000);

