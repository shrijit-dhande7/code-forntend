import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required')
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required')
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      userCode: z.string().min(1, 'User code is required'),
      boilerCode: z.string().min(1, 'Boilerplate code is required')
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3, 'All three languages required')
});

function AdminPanel() {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: 'C++', userCode: '', boilerCode: '' },
        { language: 'Java', userCode: '', boilerCode: '' },
        { language: 'JavaScript', userCode: '', boilerCode: '' }
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">Title</label>
              <input {...register('title')} className="input input-bordered w-full" />
              {errors.title && <p className="text-error">{errors.title.message}</p>}
            </div>
            <div className="form-control">
              <label className="label">Description</label>
              <textarea {...register('description')} className="textarea textarea-bordered h-32 w-full" />
              {errors.description && <p className="text-error">{errors.description.message}</p>}
            </div>
            <div className="flex gap-4">
              <div className="form-control w-1/2">
                <label className="label">Difficulty</label>
                <select {...register('difficulty')} className="select select-bordered">
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="form-control w-1/2">
                <label className="label">Tag</label>
                <select {...register('tags')} className="select select-bordered">
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>

          <div className="space-y-4 mb-6">
            <h3 className="font-medium">Visible Test Cases</h3>
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
                <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
                <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="textarea textarea-bordered w-full" />
                <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-primary">Add Visible Case</button>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Hidden Test Cases</h3>
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
                <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
                <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-primary">Add Hidden Case</button>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          <div className="space-y-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">{['C++', 'Java', 'JavaScript'][index]}</h3>

                <div className="form-control">
                  <label className="label">Boilerplate Code</label>
                  <textarea {...register(`startCode.${index}.boilerCode`)} className="textarea textarea-bordered w-full" rows={4} />
                </div>
                <div className="form-control">
                  <label className="label">User Code</label>
                  <textarea {...register(`startCode.${index}.userCode`)} className="textarea textarea-bordered w-full" rows={4} />
                </div>
                <input type="hidden" value={['C++', 'Java', 'JavaScript'][index]} {...register(`startCode.${index}.language`)} />

                <div className="form-control">
                  <label className="label">Reference Solution</label>
                  <textarea {...register(`referenceSolution.${index}.completeCode`)} className="textarea textarea-bordered w-full" rows={4} />
                </div>
                <input type="hidden" value={['C++', 'Java', 'JavaScript'][index]} {...register(`referenceSolution.${index}.language`)} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">Create Problem</button>
      </form>
    </div>
  );
}

export default AdminPanel;
