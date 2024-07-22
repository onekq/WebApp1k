import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import MyComponent from './coverLetterAttachments';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successful cover letter attachment.', async () => {
  fetchMock.post('/attachCoverLetter', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-letter-input'), { target: { value: 'Cover Letter Text' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('attach-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cover Letter Attached Successfully')).toBeInTheDocument();
}, 10000);

test('failure cover letter attachment.', async () => {
  fetchMock.post('/attachCoverLetter', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-letter-input'), { target: { value: 'Cover Letter Text' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('attach-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Attach Cover Letter')).toBeInTheDocument();
}, 10000);

