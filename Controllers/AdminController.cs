using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Prototype.Controllers
{
    public class AdminController : Controller
    {
        public ActionResult Position()
        {
            return View();
        }

        public ActionResult Employee()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Supplier()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult JobType() {
            return View();
        }
        public ActionResult RequestType()
        {
            return View();
        }

        public ActionResult EventType()
        {
            return View();
        }

        public ActionResult Event()
        {
            return View();
        }

        public ActionResult Category()
        {
            return View();
        }

        public ActionResult Product()
        {
            return View();
        }

        public ActionResult ExpenseType()
        {
            return View();
        }

        public ActionResult Expense()
        {
            return View();
        }
    }
}