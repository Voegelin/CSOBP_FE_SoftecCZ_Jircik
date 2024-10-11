/**
 * Zde vytvořte formulář pomocí knihovny react-hook-form.
 * Formulář by měl splňovat:
 * 1) být validován yup schématem
 * 2) formulář obsahovat pole "NestedFields" z jiného souboru
 * 3) být plně TS typovaný
 * 4) nevalidní vstupy červeně označit (background/outline/border) a zobrazit u nich chybové hlášky
 * 5) nastavte výchozí hodnoty objektem initalValues
 * 6) mít "Submit" tlačítko, po jeho stisku se vylogují data z formuláře:  "console.log(formData)"
 *
 * V tomto souboru budou definovány pole:
 * amount - number; Validace min=0, max=300
 * damagedParts - string[] formou multi-checkboxu s volbami "roof", "front", "side", "rear"
 * vykresleny pole z form/NestedFields
 */

// příklad očekávaného výstupního JSON, předvyplňte tímto objektem formulář
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { NestedFields } from './NestedFields';

const initialValues = {
  amount: 250,
  allocation: 140,
  damagedParts: ['side', 'rear'],
  category: 'kitchen-accessories',
  witnesses: [
    {
      name: 'Marek',
      email: 'marek@email.cz',
    },
    {
      name: 'Emily',
      email: 'emily.johnson@x.dummyjson.com',
    },
  ],
};

export const MainForm = () => {
  const resolver = yup.object({
    amount: yup.number().min(0).max(150).required('Value is required!'),
    allocation: yup
      .number()
      .min(0)
      .required('Value is required!')
      .test({
        name: 'max',
        test: (value, context) => value < context.parent.amount,
      }),
    damagedParts: yup.array().required(),
    category: yup.string(),
    witnesses: yup.array(),
  });
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(resolver),
  });

  const damagedParts = methods.watch('damagedParts');

  const getCheckBox = (name: string) => {
    return (
      <span key={name}>
        {name}
        <input
          type="checkbox"
          checked={damagedParts.includes(name)}
          onChange={(evt) => {
            if (evt.target.checked) {
              methods.setValue('damagedParts', [...damagedParts, name]);
            } else {
              methods.setValue('damagedParts', [
                ...damagedParts.filter((val) => val !== name),
              ]);
            }
          }}
        />
      </span>
    );
  };

  const damagedPartsValues = ['roof', 'front', 'side', 'rear'];

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          console.log(methods.getValues());
        }}
      >
        <input {...methods.register('amount')} />
        <br />
        {damagedPartsValues.map((val) => getCheckBox(val))}
        <br />
        <NestedFields />
        <br />
        <input type="submit" />
      </form>
    </FormProvider>
  );
};
