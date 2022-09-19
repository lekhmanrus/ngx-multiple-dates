/**
 * An event used for `ngx-multiple-dates` date removal.
 * @template D Date type.
 */
export class DateRemoveEvent<D = Date> {
  /** Event type Specifies where the date was removed from (chip, datepicker). */
  type: 'chip' | 'datepicker';
  /** Date removed. */
  date: D;
}
