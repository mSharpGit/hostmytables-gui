import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/webapp/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/webapp/floorplan', title: 'Floor Plan',  icon:'business', class: '' },
    { path: '/webapp/reserve', title: 'Reserve',  icon:'book', class: '' },
    { path: '/webapp/waitinglist', title: 'Waiting List',  icon:'content_paste', class: '' },
    { path: '/webapp/guests', title: 'Guests',  icon:'person', class: '' },
    /* { path: '/webapp/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    { path: '/webapp/typography', title: 'Typography',  icon:'library_books', class: '' },
    { path: '/webapp/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    { path: '/webapp/maps', title: 'Maps',  icon:'location_on', class: '' },
    { path: '/webapp/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/webapp/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' }, */
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
