import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './viewActivitySummary_viewSymptomsLog_addPetProfile_reportAPost';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Views activity summary successfully. (from viewActivitySummary_viewSymptomsLog)', async () => {
  fetchMock.get('/activities/summary', { summary: 'Activity summary data' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByText('Activity summary data')).toBeInTheDocument();
}, 10000);

test('Fails to view activity summary with error message. (from viewActivitySummary_viewSymptomsLog)', async () => {
  fetchMock.get('/activities/summary', { status: 500, body: { message: 'Failed to fetch summary' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/activities/summary').length).toBe(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('View symptoms log successfully (from viewActivitySummary_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', [{ id: 1, description: 'Coughing' }]);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Coughing')).toBeInTheDocument();
}, 10000);

test('Fail to view symptoms log with error (from viewActivitySummary_viewSymptomsLog)', async () => {
  fetchMock.get('/api/symptoms', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls('/api/symptoms').length).toBe(1);
  expect(screen.getByText('Failed to fetch symptoms log')).toBeInTheDocument(); // Error message
}, 10000);

test('Add pet profile successfully. (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/pets', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: 'Fluffy'}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Pet profile added successfully.')).toBeInTheDocument();
}, 10000);

test('Fail to add pet profile due to missing name. (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/pets', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/name/i), {target: {value: ''}}); });
  await act(async () => { fireEvent.click(screen.getByText(/Add Pet/i)); });

  expect(fetchMock.calls('/api/pets').length).toBe(1);
  expect(screen.getByText('Name is required.')).toBeInTheDocument();
}, 10000);

test('Successfully reports an inappropriate post (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/community/report', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Post reported successfully')).toBeInTheDocument();
}, 10000);

test('Fails to report an inappropriate post (from addPetProfile_reportAPost)', async () => {
  fetchMock.post('/api/community/report', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('report-button', { name: /report/i })); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to report post')).toBeInTheDocument();
}, 10000);

