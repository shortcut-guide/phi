type Props = {
  name: string;
};
export default function TestComponent({ name }: { name: string }) {
  return <h1>Test {name}!</h1>;
}