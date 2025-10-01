import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './automatedReminders_materialVersionControl_progressReportGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully sends automated reminders for deadlines', async () => {
  fetchMock.post('/reminders', { status: 200 });

  await act(async () => { render(<MemoryRouter><AutomatedReminders /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders sent')).toBeInTheDocument();
}, 10000);

test('Fails to send automated reminders for deadlines', async () => {
  fetchMock.post('/reminders', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><AutomatedReminders /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Send Reminders')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Reminders failed')).toBeInTheDocument();
}, 10000);

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

test('Progress report can be generated successfully.', async () => {
  fetchMock.get('/api/progress-report', { report: 'Mock Report' });

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Mock Report/i)).toBeInTheDocument();
}, 10000);

test('Progress report generation fails if the server returns an error.', async () => {
  fetchMock.get('/api/progress-report', 500);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Failed to generate progress report/i)).toBeInTheDocument();
}, 10000);
