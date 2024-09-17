import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './contentTranslationHandling_courseImportExport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Content Translation Handling success: should display translated content.', async () => {
  fetchMock.get('/api/courses/1?lang=es', { id: 1, title: 'Curso de Reacto', details: 'Informaci�n detallada' });

  await act(async () => { render(<MemoryRouter><App courseId={1} language="es" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Curso de Reacto')).toBeInTheDocument();
}, 10000);

test('Content Translation Handling failure: should display an error message on translation failure.', async () => {
  fetchMock.get('/api/courses/1?lang=es', 404);

  await act(async () => { render(<MemoryRouter><App courseId={1} language="es" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content cannot be translated.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export success: should display success message on course import.', async () => {
  fetchMock.post('/api/import-course', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course successfully imported.')).toBeInTheDocument();
}, 10000);

test('Course Import/Export failure: should display an error message on course import failure.', async () => {
  fetchMock.post('/api/import-course', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('file-upload'), { target: { files: [new File([''], 'course.json')] } }); });
  await act(async () => { fireEvent.click(screen.getByText('Import Course')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to import course.')).toBeInTheDocument();
}, 10000);