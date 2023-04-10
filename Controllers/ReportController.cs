using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Prototype.Controllers
{
    public class ReportController : Controller
    {
        public ActionResult Sales()
        {
            return View();
        }

        public ActionResult Employee()
        {
            return View();
        }

        public ActionResult Inventory()
        {
            return View();
        }
    }
}