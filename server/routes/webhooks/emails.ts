import { render } from '@vue-email/render';
import ExampleMail from '~/emails/ExampleMail.vue';


export default defineEventHandler(async () => {
    const html = await render(ExampleMail,{
        title: 'some title',
      },{
        pretty: true,
      });

    return html;
      
})