import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { formToJSON } from 'axios';

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
  ).length(3),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required')
    })
  ).length(3)
});

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema)
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: 'visibleTestCases'
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control,
    name: 'hiddenTestCases'
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${id}`);
        reset(data);
       
      } catch (error) {
        alert('Failed to fetch problem');
      }
    };

    fetchProblem();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await axiosClient.put(`/problem/update/${id}`, data);
      alert('Problem updated successfully!');
      navigate('/'); // or wherever you want to go
    } catch (error) {
      alert(`Update failed: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Problem</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BASIC INFO */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="form-control mb-4">
            <label className="label">Title</label>
            <input {...register('title')} className="input input-bordered w-full" />
            {errors.title && <p className="text-error">{errors.title.message}</p>}
          </div>
          <div className="form-control mb-4">
            <label className="label">Description</label>
            <textarea {...register('description')} className="textarea textarea-bordered w-full" />
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

        {/* TEST CASES */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
          <div className="space-y-4">
            <h3 className="font-medium">Visible Test Cases</h3>
            {visibleFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <input {...register(`visibleTestCases.${index}.input`)} className="input input-bordered w-full" placeholder="Input" />
                <input {...register(`visibleTestCases.${index}.output`)} className="input input-bordered w-full" placeholder="Output" />
                <textarea {...register(`visibleTestCases.${index}.explanation`)} className="textarea textarea-bordered w-full" placeholder="Explanation" />
                <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-error">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => appendVisible({ input: '', output: '', explanation: '' })} className="btn btn-sm btn-primary">Add Visible</button>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="font-medium">Hidden Test Cases</h3>
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="border p-4 rounded-lg space-y-2">
                <input {...register(`hiddenTestCases.${index}.input`)} className="input input-bordered w-full" placeholder="Input" />
                <input {...register(`hiddenTestCases.${index}.output`)} className="input input-bordered w-full" placeholder="Output" />
                <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-error">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => appendHidden({ input: '', output: '' })} className="btn btn-sm btn-primary">Add Hidden</button>
          </div>
        </div>

        {/* CODE SECTIONS */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Code Templates</h2>
          {['C++', 'Java', 'JavaScript'].map((lang, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-medium">{lang}</h3>
              <textarea {...register(`startCode.${i}.boilerCode`)} className="textarea textarea-bordered w-full" placeholder="Boilerplate Code" rows={4} />
              <textarea {...register(`startCode.${i}.userCode`)} className="textarea textarea-bordered w-full mt-2" placeholder="User Code" rows={4} />
              <textarea {...register(`referenceSolution.${i}.completeCode`)} className="textarea textarea-bordered w-full mt-2" placeholder="Reference Solution" rows={4} />
              <input type="hidden" {...register(`startCode.${i}.language`)} value={lang} />
              <input type="hidden" {...register(`referenceSolution.${i}.language`)} value={lang} />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary w-full">Update Problem</button>
      </form>
    </div>
  );
};

export default Update;
