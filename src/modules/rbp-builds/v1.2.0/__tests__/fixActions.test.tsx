// <!-- BEGIN RBP GENERATED: builds-readiness-v1 -->
import { startFixSelection } from '../components/FixActions';

describe('rbp-builds v1.2.0 Fix actions', () => {
  beforeEach(() => {
  document.body.innerHTML = '';
    // JSDOM URL base
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = new URL('https://example.com/') as any;
  });

  it('dispatches start-part-selection and deep-links query', async () => {
    const spy = jest.fn();
    window.addEventListener('rbp:start-part-selection', spy);
  startFixSelection('Rod', 'slot-1');
    expect(spy).toHaveBeenCalled();
    const url = new URL(window.location.href);
    expect(url.searchParams.get('type')).toBeTruthy();
    expect(url.searchParams.get('slot')).toBeTruthy();
  });
});
// <!-- END RBP GENERATED: builds-readiness-v1 -->
